import { webService } from './webservice';

export type CmsSection = {
  id: string;
  sectionKey: string;
  title: string;
  payloadJson: string;
  isEnabled: boolean;
  displayOrder: number;
};

export async function upsertCmsSection(section: CmsSection): Promise<void> {
  await webService<CmsSection>('/api/v1/admin/cms/sections', {
    method: 'POST',
    body: JSON.stringify(section)
  });
}
