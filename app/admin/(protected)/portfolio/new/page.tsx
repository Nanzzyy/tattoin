import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
  return <main className="adminMain"><header className="adminPageHeader adminPageHeader--editor"><div><p className="adminEyebrow">Portfolio / New</p><h1>Add artwork</h1><p>Publish a new piece to the studio gallery.</p></div></header><PortfolioForm /></main>;
}
