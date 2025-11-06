"useClient";
import React from "react";
import { Upload, FileText, X, Edit3 } from "lucide-react";
import SourceMixFlow from "./SourceMixFlow";
import { useCallback, useState } from "react";

export const Step5ContentPreferences = ({bookId, subject, formData}) => {
  const [sourceOption, setSourceOption] = useState("upload");
  const [sourceMix, setSourceMix] = useState({
    primary: 80,
    trusted: 15,
    internet: 5,
  });

  return (
    <div className="space-y-6">
      <SourceMixFlow
        option={sourceOption}
        onOptionChange={setSourceOption}
        value={sourceMix}
        onChange={setSourceMix}
        bookId={bookId}
        subject={subject}
        formData={formData}
      />
    </div>
  );
};

