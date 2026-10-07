import { PARISHES, optionalHttpUrl, textField } from "@/app/add-listing/validation";

export const VERDICTS = ["RUN_GO_GET_IT", "WORTH_IT", "MID", "SAVE_YOUR_MONEY"] as const;
export function parseRestaurant(form: FormData) {
  const parish = textField(form, "parish", 50, 1);
  if (!(PARISHES as readonly string[]).includes(parish)) throw new Error("Invalid parish");
  const slug = textField(form, "slug", 160, 1);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid slug");
  const price = textField(form, "price_level", 1);
  if (price && !/^[1-4]$/.test(price)) throw new Error("Invalid price");
  return {
    name: textField(form, "name", 160, 2), slug, parish,
    area: textField(form, "area", 160) || null,
    description: textField(form, "description", 5000),
    cuisine_type: textField(form, "cuisine_type", 100) || null,
    category: textField(form, "category", 80) || null,
    phone: textField(form, "phone", 40) || null,
    image_url: optionalHttpUrl(textField(form, "image_url", 2048)),
    price_level: price ? Number(price) : null,
    price_range: price ? "$".repeat(Number(price)) : null,
    is_verified: form.get("is_verified") === "on"
  };
}

export function parseCriticReview(form: FormData) {
  const verdict = textField(form, "verdict", 30, 1);
  if (!(VERDICTS as readonly string[]).includes(verdict)) throw new Error("Choose a verdict");
  const score = textField(form, "admin_score", 3, 1);
  if (!/^\d{1,3}$/.test(score) || Number(score) > 100) throw new Error("Invalid score");
  const date = textField(form, "visit_date", 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > new Date().toISOString().slice(0, 10)) throw new Error("Invalid visit date");
  if (form.get("publish_confirmed") !== "on") throw new Error("Confirm publication");
  return { verdict, admin_score: Number(score), headline: textField(form, "headline", 200, 5), honest_take: textField(form, "honest_take", 10000, 30), visit_date: date };
}
