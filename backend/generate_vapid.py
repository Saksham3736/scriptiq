import base64
import ecdsa

def generate_vapid_keys():
    private_key = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p)
    public_key = private_key.get_verifying_key()

    private_b64 = base64.urlsafe_b64encode(private_key.to_string()).decode('utf-8').rstrip('=')
    pub_bytes = b'\x04' + public_key.to_string()
    public_b64 = base64.urlsafe_b64encode(pub_bytes).decode('utf-8').rstrip('=')

    print(f"VAPID_PRIVATE_KEY={private_b64}")
    print(f"VAPID_PUBLIC_KEY={public_b64}")

if __name__ == "__main__":
    generate_vapid_keys()
