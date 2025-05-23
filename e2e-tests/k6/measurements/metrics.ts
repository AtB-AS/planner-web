import { Trend } from 'k6/metrics';

export class Metrics {
  private metric_assistant_firstResult: Trend;
  private metric_assistant_lastResult: Trend;
  private metric_assistant_summary_open: Trend;
  private metric_assistant_details_open: Trend;
  private metric_assistant_region_firstResult: Trend;
  private metric_assistant_region_lastResult: Trend;
  private metric_assistant_region_summary_open: Trend;
  private metric_assistant_region_details_open: Trend;
  private metric_departures_show: Trend;
  private metric_departures_details_open: Trend;

  constructor() {
    this.metric_assistant_firstResult = new Trend(
      'metric_assistant_firstResult',
      true,
    );
    this.metric_assistant_lastResult = new Trend(
      'metric_assistant_lastResult',
      true,
    );
    this.metric_assistant_summary_open = new Trend(
      'metric_assistant_summary_open',
      true,
    );
    this.metric_assistant_details_open = new Trend(
      'metric_assistant_details_open',
      true,
    );
    this.metric_assistant_region_firstResult = new Trend(
      'metric_assistant_region_firstResult',
      true,
    );
    this.metric_assistant_region_lastResult = new Trend(
      'metric_assistant_region_lastResult',
      true,
    );
    this.metric_assistant_region_summary_open = new Trend(
      'metric_assistant_region_summary_open',
      true,
    );
    this.metric_assistant_region_details_open = new Trend(
      'metric_assistant_region_details_open',
      true,
    );
    this.metric_departures_show = new Trend('metric_departures_show', true);
    this.metric_departures_details_open = new Trend(
      'metric_departures_details_open',
      true,
    );
  }

  metricAssistantFirstResult(value: number, region: boolean) {
    if (region) {
      this.metric_assistant_region_firstResult.add(value);
    } else {
      this.metric_assistant_firstResult.add(value);
    }
  }

  metricAssistantLastResult(value: number, region: boolean) {
    if (region) {
      this.metric_assistant_region_lastResult.add(value);
    } else {
      this.metric_assistant_lastResult.add(value);
    }
  }

  metricAssistantSummaryOpen(value: number, region: boolean) {
    if (region) {
      this.metric_assistant_region_summary_open.add(value);
    } else {
      this.metric_assistant_summary_open.add(value);
    }
  }

  metricAssistantDetailsOpen(value: number, region: boolean) {
    if (region) {
      this.metric_assistant_region_details_open.add(value);
    } else {
      this.metric_assistant_details_open.add(value);
    }
  }

  metricDeparturesShow(value: number) {
    this.metric_departures_show.add(value);
  }

  metricDeparturesDetailsOpen(value: number) {
    this.metric_departures_details_open.add(value);
  }
}
