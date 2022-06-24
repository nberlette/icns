/**
 * URL Request Parameters for serving up hot icons.
 */
export declare interface IconParams {
  color?: string;
  colorhash?: string;
  collection?: string;
  slug: string;
}

/**
 * Some common SVG attributes we can expect to encounter.
 */
export declare interface IconAttributes {
  xmlns: string;
  viewBox: `${number} ${number} ${number} ${number}`;
  width: string | number;
  height: string | number;
  fill: string;
  stroke: string;
  [prop: string]: string | number | boolean;
}

export declare type IconProps = Partial<IconAttributes>;
