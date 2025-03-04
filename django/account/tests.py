from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from .models import User
from shortuuid import uuid


class AccountTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testadmin",
            uid=uuid(),
            email="testadmin@gmail.com",
            first_name="test",
            last_name="admin",
            contact_number=1234567899,
            contact_number_country_code=91,
            password="testpassword",
        )
        self.client.force_authenticate(user=self.user)

    def test_create_user(self):
        url = reverse("user-list")
        data = {
            "username": "testuser",
            "email": "test@gmail.com",
            "first_name": "test",
            "last_name": "user",
            "contact_number": 1234567890,
            "contact_number_country_code": 91,
            "password": "hard$139",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(
            "uid" in response.data
            and "profile" in response.data
            and "address" in response.data,
            "uid, profile, address should be in response",
        )

    def test_update_user(self):
        url = reverse("user-detail", kwargs={"pk": self.user.id})
        data = {
            "first_name": "updated_test",
            "username": "updatedusername",
            "password": "updatedpassword",
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["first_name"], "updated_test")

    def test_get_user(self):
        url = reverse("user-detail", kwargs={"pk": self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            "password" not in response.data and "username" not in response.data,
            "password and username should not be in response",
        )