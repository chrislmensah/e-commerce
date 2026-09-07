import unittest

from ecommerce.platform import CommercePlatform, OrderStatus


class CommercePlatformTests(unittest.TestCase):
    def setUp(self) -> None:
        self.platform = CommercePlatform()
        self.platform.upsert_product("tee-001", "Classic Tee", "Unisex cotton t-shirt")
        self.platform.set_variant("tee-001", size="M", color="Black", price=25.0, stock=2)

    def test_admin_stock_updates_are_visible_in_web_and_mobile_catalogs(self) -> None:
        web_catalog = self.platform.browse_catalog("web")
        mobile_catalog = self.platform.browse_catalog("mobile")

        self.assertEqual(web_catalog[0].variants[("M", "Black")].stock, 2)
        self.assertEqual(mobile_catalog[0].variants[("M", "Black")].stock, 2)

        self.platform.set_variant("tee-001", size="M", color="Black", price=25.0, stock=5)

        self.assertEqual(self.platform.browse_catalog("web")[0].variants[("M", "Black")].stock, 5)
        self.assertEqual(self.platform.browse_catalog("mobile")[0].variants[("M", "Black")].stock, 5)

    def test_checkout_supports_local_payment_providers_and_prevents_oversell(self) -> None:
        self.platform.add_to_cart("web", "cust-web", "tee-001", "M", "Black", 2)
        order = self.platform.checkout("web", "cust-web", "paystack", "card")

        self.assertEqual(order.payment_gateway.value, "paystack")
        self.assertEqual(order.payment_method.value, "card")
        self.assertEqual(self.platform.browse_catalog("mobile")[0].variants[("M", "Black")].stock, 0)

        with self.assertRaises(ValueError):
            self.platform.add_to_cart("mobile", "cust-mobile", "tee-001", "M", "Black", 1)

        self.platform.set_variant("tee-001", size="M", color="Black", price=25.0, stock=1)
        self.platform.add_to_cart("mobile", "cust-mobile", "tee-001", "M", "Black", 1)
        self.platform.set_variant("tee-001", size="M", color="Black", price=25.0, stock=0)
        with self.assertRaises(ValueError):
            self.platform.checkout("mobile", "cust-mobile", "flutterwave", "mobile_money")

        self.platform.set_variant("tee-001", size="M", color="Black", price=25.0, stock=1)
        retry_order = self.platform.checkout("mobile", "cust-mobile", "flutterwave", "mobile_money")
        self.assertEqual(retry_order.payment_gateway.value, "flutterwave")
        self.assertEqual(retry_order.payment_method.value, "mobile_money")

    def test_admin_can_move_orders_through_fulfillment_states(self) -> None:
        self.platform.add_to_cart("web", "cust-web", "tee-001", "M", "Black", 1)
        order = self.platform.checkout("web", "cust-web", "paystack", "card")

        self.platform.update_order_status(order.order_id, OrderStatus.PROCESSING)
        self.platform.update_order_status(order.order_id, OrderStatus.SHIPPED)
        self.platform.update_order_status(order.order_id, OrderStatus.DELIVERED)

        self.assertEqual(self.platform.get_order(order.order_id).status, OrderStatus.DELIVERED)

        with self.assertRaises(ValueError):
            self.platform.update_order_status(order.order_id, OrderStatus.CANCELLED)


if __name__ == "__main__":
    unittest.main()
