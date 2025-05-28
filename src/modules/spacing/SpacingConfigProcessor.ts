import { join } from 'path';

import { convertToCSS } from '../../utils/helpers';
import { processSizes } from '../../utils/processSizes';
import { ISpacingConfig } from '../interfaces';
import { IConfigProcessor } from '../shared/ConfigProcessor';

export class SpacingConfigProcessor implements IConfigProcessor<ISpacingConfig> {
  async processConfig(config: ISpacingConfig, force: boolean): Promise<{path: string}[]> {
    const processedSpacing = processSizes(config, 'spacing', 'spacing');
      const { outDir, data } = processedSpacing;
  
      const spacingCss = convertToCSS(data)


    // --------------------------------------------------
    // Write files

    return [
      { path: join(outDir, 'spacing.css'), content: spacingCss },
    ].filter((file): file is { path: string; content: string } => file.content !== undefined);    
  }
}