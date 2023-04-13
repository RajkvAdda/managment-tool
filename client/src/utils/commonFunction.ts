/* eslint-disable no-cond-assign */
/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
export const groupBy = (items: any[], key: string | number) =>
  items.reduce(
    (result: { [x: string]: any }, item: { [x: string]: string | number }) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

export const shallowObjCompare = (
  prev: { [s: string]: unknown } | ArrayLike<unknown>,
  next: { [x: string]: unknown }
) => Object.entries(prev).some(([key, value]) => value != next[key]);

export const getObjDiffrence = (
  oldObj: { [s: string]: unknown } | ArrayLike<unknown>,
  newObj: { [x: string]: any }
) => {
  let params = {};
  Object.entries(oldObj).map(([key, value]) => {
    if (value != newObj[key]) {
      params[key] = newObj[key];
    }
  });
  return params;
};

export const sortingData = (data: any[], name: string | number, isTrue: any) => {
  let records = data;
  if (name && data?.length) {
    records = data?.slice()?.sort((a: { [x: string]: string }, b: { [x: string]: string }) => {
      const aName = a?.[name] ?? '';
      const bName = b?.[name] ?? '';
      if (isTrue) {
        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }
      } else {
        if (bName < aName) {
          return -1;
        }
        if (bName > aName) {
          return 1;
        }
      }
      return 0;
    });
  }
  return records;
};

export const getRupeeInWord = (rupee: { toString: () => any }) => {
  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  let n;
  if ((rupee = rupee.toString()).length > 11) return 'overflow';
  n = ('00000000000' + Number(rupee)?.toFixed(2)?.split('.')?.join(''))
    .substr(-11)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})(\d{2})$/);
  console.log(n);
  if (!n) return;
  let str = '';
  str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += n[5] != 0 ? (str != '' ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees ' : 'Rupees ';
  str +=
    n[6] != 0 ? (str != '' ? 'and ' : '') + (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) + 'Paisa Only' : 'Only';
  return str;
};
