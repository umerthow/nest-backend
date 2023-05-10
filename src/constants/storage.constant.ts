import { IGeneralKey } from '@interfaces/common/igeneral.interface';

export const FILE_MIME_SUPPORTED: IGeneralKey = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  zip: 'application/zip'
};

export const FILE_ICON_SUPPORTED: IGeneralKey = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif'
};

export const baseStorageDirectory = (isTargetProduction = false) => (isTargetProduction ? 'live' : 'staging');
