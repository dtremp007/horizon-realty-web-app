import { createFilterPropListItem } from ".";
import { readFileSync } from "fs";
import path from "path";
import { parseMetadata } from "../../pages/admin/filters";



const localMetadata = parseMetadata(
  JSON.parse(
    readFileSync(path.join(process.cwd(), "lib", "metadata.json"), {
      encoding: "utf-8",
    })
  )
);

const test_obj_1: any = {
    value: {
        type: "text"
      },
      label: {
        type: "text"
      }
}

const test_form: any = {
    values: {
        type: "CheckboxtList"
    }
}

describe("horizon-web-app/util/createnfilterPropListItem", () => {
    it("can create a filterListPropItem", () => {
        expect(createFilterPropListItem(test_form, test_obj_1)).toEqual({value: "", label: ""})
    })
})
