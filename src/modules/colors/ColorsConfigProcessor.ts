import { join } from 'path';

import { convertToCSS } from '../../utils/helpers';
import { IColorsConfig } from '../interfaces';
import { IConfigProcessor } from '../shared/ConfigProcessor';
import { processColors } from './processColors';

export class ColorsConfigProcessor implements IConfigProcessor<IColorsConfig> {
  async processConfig(config: IColorsConfig, force: boolean): Promise<{path: string}[]> {
    const processedColors = processColors(config);
    const { outDir, data } = processedColors;
    const colorsCss = convertToCSS(data)

    // --------------------------------------------------
    // Write files

    return [
      { path: join(outDir, 'colors.css'), content: colorsCss },
    ].filter((file): file is { path: string; content: string } => file.content !== undefined);
  }
}
