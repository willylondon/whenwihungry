import { isEmail, isUuid } from "@/lib/validation";
import { textField } from "@/app/add-listing/validation";

export function parseReviewRequest(form: FormData) {
  const id = textField(form, "request_id", 36, 36);
  if (!isUuid(id)) throw new Error("Invalid request ID");
  if (textField(form, "website_confirm", 200)) throw new Error("Invalid submission");
  const email = textField(form, "email", 254, 3).toLowerCase();
  if (!isEmail(email)) throw new Error("Invalid email");
  return {
    id,
    contact_name: textField(form, "name", 120, 2),
    restaurant_name: textField(form, "restaurant", 160, 2),
    location: textField(form, "location", 240, 2),
    contact_email: email,
    contact_phone: textField(form, "phone", 40) || null,
    message: textField(form, "message", 3000, 10)
  };
}
