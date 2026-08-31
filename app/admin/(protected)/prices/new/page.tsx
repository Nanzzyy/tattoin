import { PriceForm } from "@/components/admin/price-form";

export default function NewPricePage() {
  return <main className="adminMain"><header className="adminPageHeader adminPageHeader--editor"><div><p className="adminEyebrow">Price list / New</p><h1>Add service</h1><p>Create a clear guide price for a studio service.</p></div></header><PriceForm /></main>;
}
