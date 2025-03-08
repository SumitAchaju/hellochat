import chatapi.settings as settings
from PIL import ImageFile


def set_jwt_cookies(response, access_token, refresh_token):
    """Helper function to set JWT tokens in cookies."""
    response.set_cookie(
        "access",
        access_token,
        max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        httponly=True,
        samesite="None",
    )

    response.set_cookie(
        "refresh",
        refresh_token,
        max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        httponly=True,
        samesite="None",
    )

    return response


class JWTTokenCookieMixin:
    """Mixin to handle JWT token processing and setting cookies."""

    def post(self, request, *args, **kwargs):
        """Override the post method to add token handling logic."""
        # Call the original view's post method to process the tokens
        if hasattr(super(), "post"):
            response = super().post(request, *args, **kwargs)

            # Get the access and refresh tokens from the response
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # Set the tokens in cookies using the helper method
            response = set_jwt_cookies(response, access_token, refresh_token)

            return response

        else:
            raise NotImplementedError("base class doesnot have post method")


def resize_image(img: ImageFile, size: tuple[int, int]) -> ImageFile:
    width, height = img.size
    resize_width, resize_height = size
    if width < resize_width or height < resize_height:
        return img
    else:
        aspect_ratio = width / height

        if aspect_ratio > 1:
            new_height = resize_height
            new_width = int(new_height * aspect_ratio)
            return img.resize((new_width, new_height))
        else:
            new_width = resize_width
            new_height = int(new_width / aspect_ratio)
            return img.resize((new_width, new_height))
