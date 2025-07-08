import {
  OptionalUrlsKeyEnum,
  OptionalUrlsLabelEnum,
  OptionalUrlsSubtextEnum,
} from "../types/enumTypes";

export const listingMaxDays = 60;
export const expiringSoonDays = 14;

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
  subtext: OptionalUrlsSubtextEnum;
};

export const optionalUrlsArray: OptionalUrlHeader[] = [
  {
    key: OptionalUrlsKeyEnum.listingPageUrl,
    label: OptionalUrlsLabelEnum.listingPageUrl,
    subtext: OptionalUrlsSubtextEnum.listingPageUrl,
  },
  {
    key: OptionalUrlsKeyEnum.walkTourUrl,
    label: OptionalUrlsLabelEnum.walkTourUrl,
    subtext: OptionalUrlsSubtextEnum.optionalUrl,
  },
  {
    key: OptionalUrlsKeyEnum.floorPlanUrl,
    label: OptionalUrlsLabelEnum.floorPlanUrl,
    subtext: OptionalUrlsSubtextEnum.optionalUrl,
  },
  {
    key: OptionalUrlsKeyEnum.otherUrl1,
    label: OptionalUrlsLabelEnum.otherUrl1,
    subtext: OptionalUrlsSubtextEnum.optionalUrl,
  },
  {
    key: OptionalUrlsKeyEnum.otherUrl2,
    label: OptionalUrlsLabelEnum.otherUrl2,
    subtext: OptionalUrlsSubtextEnum.optionalUrl,
  },
];
