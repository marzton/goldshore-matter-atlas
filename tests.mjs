import test from 'node:test';
import assert from 'node:assert/strict';
import { ELEMENTS } from './src/elements.mjs';
import worker from './src/worker.mjs';
test('118 elements have unique number and symbol',()=>{
  assert.equal(ELEMENTS.length,118);
  assert.equal(new Set(ELEMENTS.map(x=>x.number)).size,118);
  assert.equal(new Set(ELEMENTS.map(x=>x.symbol)).size,118);
  assert.equal(ELEMENTS[1].name,'Helium');
  assert.deepEqual([ELEMENTS[12].period,ELEMENTS[12].group],[3,13]);
  assert.deepEqual([ELEMENTS[117].period,ELEMENTS[117].group],[7,18]);
});
test('public API returns records without credentials',async()=>{
  const resp=await worker.fetch(new Request('https://example.com/api/v1/elements'),{});
  const data=await resp.json();
  assert.equal(resp.status,200);
  assert.equal(data.elements.length,118);
});
test('invalid element is 404',async()=>{
  const resp=await worker.fetch(new Request('https://example.com/api/v1/elements/119'),{});
  assert.equal(resp.status,404);
});
