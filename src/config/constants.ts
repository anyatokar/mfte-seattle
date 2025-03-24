import { OptionalUrlsKeyEnum, OptionalUrlsLabelEnum } from "../types/enumTypes";

export const listingMaxDays = 60;
export const expiringSoonDays = 14;

// For debugging
export const isProfilerOn = false;

export const colWidths = {
  unitSize: "120px",
  percentAmi: "100px",
  rent: "150px",
  program: "150px",
  aptNum: "100px",
  dateAvail: "175px",
  delete: "100px",
  links: "150px",
};

type OptionalUrlHeader = {
  key: OptionalUrlsKeyEnum;
  label: OptionalUrlsLabelEnum;
};

export const optionalUrlsArray: OptionalUrlHeader[] = [
  {
    key: OptionalUrlsKeyEnum.listingPageUrl,
    label: OptionalUrlsLabelEnum.listingPageUrl,
  },
  {
    key: OptionalUrlsKeyEnum.walkTourUrl,
    label: OptionalUrlsLabelEnum.walkTourUrl,
  },
  {
    key: OptionalUrlsKeyEnum.floorPlanUrl,
    label: OptionalUrlsLabelEnum.floorPlanUrl,
  },
  {
    key: OptionalUrlsKeyEnum.otherUrl1,
    label: OptionalUrlsLabelEnum.otherUrl1,
  },
  {
    key: OptionalUrlsKeyEnum.otherUrl2,
    label: OptionalUrlsLabelEnum.otherUrl2,
  },
];
