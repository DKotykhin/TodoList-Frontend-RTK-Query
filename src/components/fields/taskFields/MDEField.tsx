import React, { useMemo } from "react";
import Paper from "@mui/material/Paper";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface IMDEField {
    description?: string;
    MDEChange: (arg0: string) => void;
    autofocus: boolean;
}

const MDEField: React.FC<IMDEField> = ({ description, MDEChange, autofocus }) => {

    const options: EasyMDE.Options = useMemo(
        () => ({
            spellChecker: true,
            hideIcons: ["preview", "side-by-side", "quote"],
            maxHeight: "200px",
            autofocus,
            placeholder: "type text...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
                uniqueId: "MyUniqueID",
            },
        }),
        [autofocus]
    );
    return (
        <Paper>
            <SimpleMDE value={description} onChange={MDEChange} options={options} />
        </Paper>
    );
};

export { MDEField };
