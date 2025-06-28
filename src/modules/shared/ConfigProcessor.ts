import { IConfigBase } from '../interfaces';

export interface IConfigProcessor<TConfig extends IConfigBase<unknown>> {
  processConfig(config: TConfig, force: boolean): void;
}

export class ConfigProcessor<TConfig extends IConfigBase<unknown>> {
  private processor: IConfigProcessor<TConfig>;
  private force: boolean;

  constructor(processor: IConfigProcessor<TConfig>, force: boolean = false) {
    this.processor = processor;
    this.force = force;
  }

  setForce(force: boolean): void {
    this.force = force;
  }

  process(config: TConfig, force: boolean = this.force): void {
    this.processor.processConfig(config, force);
  }
}
  