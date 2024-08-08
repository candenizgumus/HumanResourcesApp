import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import {AdminMenuContentRenderer} from "../components/organisms/AdminMenuContentRenderer";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AdminMenuContentRenderer">
                <AdminMenuContentRenderer/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;