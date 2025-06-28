import { join } from 'path';

import { ILayoutConfig } from '../interfaces';
import { IConfigProcessor } from '../shared/ConfigProcessor';
import baseLayout from './baseLayout';
import layoutAreas from './layoutAreas';
import layoutLandmarks from './layoutLandmarks';
import layoutStructure from './layoutStructure';
import layoutUtilities from './layoutUtilities';
import { IProcessedLayout, processLayout } from './processLayout';

export class LayoutConfigProcessor implements IConfigProcessor<ILayoutConfig> {
  async processConfig(config: ILayoutConfig, force: boolean): Promise<{path: string}[]> {
    const processedLayout = processLayout(config)
    const {outDir, data} = processedLayout
    
    // --------------------------------------------------
    // Css
    
    // Config
    const baseLayoutCss = baseLayout(data as IProcessedLayout)
    
    // Utilities
    const layoutUtilitiesCss = layoutUtilities;
    
    // Structure
    const layoutStructureCss = layoutStructure;
    
    // Landmarks
    const layoutLandmarksCss = layoutLandmarks;
    
    // Areas
    const layoutAreasCss = layoutAreas;

    // Layout index
    let layoutIndex = '@import "./_base-layout.css";\n'
    layoutIndex += '@import "./_layout-utilities.css";\n'
    layoutIndex += '@import "./_layout-structure.css";\n'
    layoutIndex += '@import "./_layout-landmarks.css";\n'
    layoutIndex += '@import "./_layout-areas.css";\n'

    // --------------------------------------------------
    // Write files

    return [
      { path: join(outDir, '_base-layout.css'), content: baseLayoutCss },
      { path: join(outDir, '_layout-utilities.css'), content: layoutUtilitiesCss },
      { path: join(outDir, '_layout-structure.css'), content: layoutStructureCss },
      { path: join(outDir, '_layout-landmarks.css'), content: layoutLandmarksCss },
      { path: join(outDir, '_layout-areas.css'), content: layoutAreasCss },
      { path: join(outDir, 'layout.css'), content: layoutIndex },
    ].filter((file): file is { path: string; content: string } => file.content !== undefined);
  }
}
