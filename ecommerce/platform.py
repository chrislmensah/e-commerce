from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Tuple
import uuid


class PaymentGateway(str, Enum):
    PAYSTACK = "paystack"
    FLUTTERWAVE = "flutterwave"


class PaymentMethod(str, Enum):
    CARD = "card"
    MOBILE_MONEY = "mobile_money"


class OrderStatus(str, Enum):
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


@dataclass
class ProductVariant:
    size: str
    color: str
    price: float
    stock: int


@dataclass
class Product:
    product_id: str
    name: str
    description: str
    variants: Dict[Tuple[str, str], ProductVariant] = field(default_factory=dict)


@dataclass
class CartItem:
    product_id: str
    size: str
    color: str
    quantity: int
    unit_price: float


@dataclass
class Order:
    order_id: str
    customer_id: str
    items: List[CartItem]
    payment_gateway: PaymentGateway
    payment_method: PaymentMethod
    status: OrderStatus = OrderStatus.PAID


class CommercePlatform:
    """Single backend API/database shared by web, mobile, and admin clients."""

    _allowed_transitions = {
        OrderStatus.PAID: {OrderStatus.PROCESSING, OrderStatus.CANCELLED},
        OrderStatus.PROCESSING: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
        OrderStatus.SHIPPED: {OrderStatus.DELIVERED},
        OrderStatus.DELIVERED: set(),
        OrderStatus.CANCELLED: set(),
    }

    def __init__(self) -> None:
        self._products: Dict[str, Product] = {}
        self._carts: Dict[str, Dict[str, List[CartItem]]] = {"web": {}, "mobile": {}}
        self._orders: Dict[str, Order] = {}

    # Admin operations
    def upsert_product(self, product_id: str, name: str, description: str) -> Product:
        product = self._products.get(product_id)
        if product is None:
            product = Product(product_id=product_id, name=name, description=description)
            self._products[product_id] = product
        else:
            product.name = name
            product.description = description
        return product

    def set_variant(self, product_id: str, size: str, color: str, price: float, stock: int) -> ProductVariant:
        if stock < 0:
            raise ValueError("Stock cannot be negative")
        product = self._products.get(product_id)
        if product is None:
            raise KeyError(f"Unknown product: {product_id}")

        variant = ProductVariant(size=size, color=color, price=price, stock=stock)
        product.variants[(size, color)] = variant
        return variant

    def update_order_status(self, order_id: str, next_status: OrderStatus) -> Order:
        order = self._orders.get(order_id)
        if order is None:
            raise KeyError(f"Unknown order: {order_id}")

        if next_status not in self._allowed_transitions[order.status]:
            raise ValueError(f"Invalid status transition from {order.status} to {next_status}")

        order.status = next_status
        return order

    # Customer operations via shared API (web/mobile)
    def browse_catalog(self, channel: str) -> List[Product]:
        self._validate_channel(channel)
        return list(self._products.values())

    def add_to_cart(
        self,
        channel: str,
        customer_id: str,
        product_id: str,
        size: str,
        color: str,
        quantity: int,
    ) -> None:
        self._validate_channel(channel)
        if quantity <= 0:
            raise ValueError("Quantity must be positive")

        variant = self._get_variant(product_id, size, color)
        cart = self._carts[channel].setdefault(customer_id, [])

        existing_qty = sum(
            item.quantity
            for item in cart
            if item.product_id == product_id and item.size == size and item.color == color
        )
        if existing_qty + quantity > variant.stock:
            raise ValueError("Not enough stock available")

        cart.append(
            CartItem(
                product_id=product_id,
                size=size,
                color=color,
                quantity=quantity,
                unit_price=variant.price,
            )
        )

    def checkout(
        self,
        channel: str,
        customer_id: str,
        payment_gateway: str,
        payment_method: str,
    ) -> Order:
        self._validate_channel(channel)
        gateway = PaymentGateway(payment_gateway)
        method = PaymentMethod(payment_method)

        items = self._carts[channel].get(customer_id, [])
        if not items:
            raise ValueError("Cart is empty")

        # Final stock check to prevent overselling.
        for item in items:
            variant = self._get_variant(item.product_id, item.size, item.color)
            if item.quantity > variant.stock:
                raise ValueError("Insufficient stock during checkout")

        for item in items:
            variant = self._get_variant(item.product_id, item.size, item.color)
            variant.stock -= item.quantity

        order = Order(
            order_id=str(uuid.uuid4()),
            customer_id=customer_id,
            items=list(items),
            payment_gateway=gateway,
            payment_method=method,
        )
        self._orders[order.order_id] = order
        self._carts[channel][customer_id] = []
        return order

    def get_order(self, order_id: str) -> Order:
        order = self._orders.get(order_id)
        if order is None:
            raise KeyError(f"Unknown order: {order_id}")
        return order

    def _get_variant(self, product_id: str, size: str, color: str) -> ProductVariant:
        product = self._products.get(product_id)
        if product is None:
            raise KeyError(f"Unknown product: {product_id}")

        variant = product.variants.get((size, color))
        if variant is None:
            raise KeyError(f"Unknown variant ({size}, {color}) for product {product_id}")
        return variant

    @staticmethod
    def _validate_channel(channel: str) -> None:
        if channel not in {"web", "mobile"}:
            raise ValueError("Channel must be 'web' or 'mobile'")
