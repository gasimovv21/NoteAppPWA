from py_vapid import Vapid
from cryptography.hazmat.primitives import serialization
import base64

vapid = Vapid()
vapid.generate_keys()

public_key = vapid.public_key.public_bytes(
    encoding=serialization.Encoding.X962,
    format=serialization.PublicFormat.UncompressedPoint
)
private_key = vapid.private_key.private_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

public_key_b64url = base64.urlsafe_b64encode(public_key).rstrip(b"=").decode("utf-8")
private_key_b64url = base64.urlsafe_b64encode(private_key).rstrip(b"=").decode("utf-8")

print("VAPID_PUBLIC_KEY:", public_key_b64url)
print("VAPID_PRIVATE_KEY:", private_key_b64url)
