export const formatDisplayOrderId = (orderId: number, dateString?: string) => {
  if (!dateString) return `ORD-${orderId}`;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const idStr = orderId.toString();
  const shortId = idStr.length > 3 ? idStr.slice(-3) : idStr.padStart(3, '0');
  return `ORD-${year}-${shortId}`;
};

const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const thousands = ['', 'thousand', 'million', 'billion'];

function convertToWords(num: number): string {
  if (num === 0) return 'zero';

  let words = '';
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      words = convertHundreds(num % 1000) + thousands[i] + ' ' + words;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return words.trim();
}

function convertHundreds(num: number): string {
  let str = '';

  if (num >= 100) {
    str += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }

  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }

  if (num > 0) {
    str += ones[num] + ' ';
  }

  return str;
}

export const numberToWords = (num: number): string => {
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = convertToWords(integerPart);

  if (decimalPart > 0) {
    words += ' and ' + convertToWords(decimalPart) + ' paise';
  }

  return words.charAt(0).toUpperCase() + words.slice(1);
};
