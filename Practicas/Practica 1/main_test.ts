//Practica 1 realizada por Arturo Requejo y Nacho Moreno el 7/10/22

import { assertEquals } from "https://deno.land/std@0.157.0/testing/asserts.ts";
import final from "./main.ts";

Deno.test(function addTest() {
  assertEquals(final([ [ 1, 2, [3,4,[5,6, [7]]] ]]), [ 5040, 2520, 1680,1260, 1008,  840, 720  ]);
});
Deno.test(function addTest() {
  assertEquals(final([ [ '1', '2', ['3','4',['5','6', ['7']]] ]]), [ 5040, 2520, 1680,1260, 1008,  840, 720  ]);
});

Deno.test(function addTest() {
  assertEquals(final([ [ 1, 2, ['3',4,['5',6, [7]]] ]]), [ 5040, 2520, 1680,1260, 1008,  840, 720  ]);
});

Deno.test(function addTest() {
  assertEquals(final([ 0,[ 1, 2, ['3',4,['5',6, [7]]] ], 0]), [ 0, 0, 0,0, 0,  0, 0, 0, 0  ]);
});

Deno.test(function addTest() {
  assertEquals(final([ [ 1, '2', ['3',4,['5',6, [0]]] ]]), [ 0, 0, 0,0, 0,  0, 720  ]);
});


