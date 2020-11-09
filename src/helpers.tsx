import React from "react";

export function array(n: number) { return Array(n).fill(undefined); }
export function false_array(n: number) { return Array(n).fill(undefined); }
export function n_times_dive(n: number, label: string) {
    return array(n).map((_, i) => <div className={label + " " + label + i}></div>)
}

export type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export const all_digits: Digit[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];