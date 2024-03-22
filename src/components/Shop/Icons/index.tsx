export interface IconProps {
    className?: string;

    /**
     * The size of the icon
     *
     * @default 24
     */
    size?: number;
}

import MailOpen from "./Mail"
import X from "./X"

export {
    MailOpen,
    X,
    X as Twitter // alias
}