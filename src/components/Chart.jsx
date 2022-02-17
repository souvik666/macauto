import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Chart(props) {
  const { dataset } = props;
  return <Pie data={dataset} />;
}
