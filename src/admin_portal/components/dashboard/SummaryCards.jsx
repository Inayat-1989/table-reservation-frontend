import EmptyState from "./EmptyState";
import SectionCard from "./SectionCard";
import SummaryCard from "./SummaryCard";
import { getSummaryCards } from "../../utils/dashboardFormatters";

export default function SummaryCards({ summary }) {
  const cards = getSummaryCards(summary);

  if (!cards.length) {
    return (
      <section className="dashboard-stats-grid">
        <SectionCard title="Reservation Summary">
          <EmptyState message="No summary metrics were returned by the API." />
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="dashboard-stats-grid">
      {cards.map((item, index) => (
        <SummaryCard key={item.key} item={item} index={index} />
      ))}
    </section>
  );
}
