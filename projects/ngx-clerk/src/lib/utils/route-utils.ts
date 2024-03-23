import { UrlSegment } from "@angular/router";

export const catchAllRoute = (catchAllPath: string) => (url: UrlSegment[]) => 
    url?.[0]?.path.startsWith(catchAllPath) ? ({ consumed: url }) : null;