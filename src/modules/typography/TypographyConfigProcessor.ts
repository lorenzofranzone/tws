import { join } from 'path';

import { convertToCSS } from '../../utils/helpers';
import { processSizes } from '../../utils/processSizes';
import { ITypographyConfig } from '../interfaces';
import { IConfigProcessor } from '../shared/ConfigProcessor';

export class TypographyConfigProcessor implements IConfigProcessor<ITypographyConfig> {
  async processConfig(config: ITypographyConfig, force: boolean): Promise<{path: string}[]> {
    const processedTypography = processSizes(config, 'typography', 'text');
      const { outDir, data } = processedTypography;
  
      const typographyCss = convertToCSS(data)


    // --------------------------------------------------
    // Write files

    return [
      { path: join(outDir, 'typography.css'), content: typographyCss },
    ].filter((file): file is { path: string; content: string } => file.content !== undefined);    
  }
}