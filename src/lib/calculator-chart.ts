export interface CalculatorChartPoint {
  label: string;
  value: number;
}

export interface CalculatorChartSeries {
  label: string;
  points: CalculatorChartPoint[];
}

export interface CalculatorChartModel {
  title: string;
  description: string;
  interpretation: string;
  series: CalculatorChartSeries[];
  valuePrefix?: string;
  valueSuffix?: string;
}
