// A command-line program that prints out the sum of two non-negative integers as input arguments. 
// Input arguments are UTF-8 encoded Korean characters only listed as '일이삼사오육칠팔구' and '십백천만억조'

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const kor = {
	0: "",
	1: "일",
	2: "이",
	3: "삼",
	4: "사",
	5: "오",
	6: "육",
	7: "칠",
	8: "팔",
	9: "구",
	10: "십",
	100: "백",
	1000: "천",
	10000: "만",
	100000000: "억",
	1000000000000: "조",
};

// swaps Object keys & values reversely
const swapKeyValue = (data) =>
	Object.keys(data).reduce(
		(obj, key) => Object.assign({}, obj, { [data[key]]: key }),
		{}
	);

// N's time mulpiplication (by 10, 100, 1000 ..)
const nNimes = (n) =>
	"" +
	(n >= 1
		? Array(n)
				.fill()
				.reduce((p) => 10 * (p || 1), 0) / 10
		: 1);

// split string into array of single chars
const separateNums = (arr) => Array.from(arr + "");

// arguments addition: INTEGER input
const argsIntAddition = (args) => args.reduce((n, p) => n + toNumber(p), 0);

// arguments addition: CHARACTER input
const argsCharsAddition = (args) => args.reduce((n, p) => n + charToNum(p), 0);

// Build number
const toNumber = (str) =>
	separateNums(str)
		.reverse()
		.reduce((v, x, ix) => v + x * nNimes(ix + 1), 0);

const getNumberBetween = (str, x, p) => {
	const n =
		str.length > 5 && str.length < 9
			? 5
			: str.length > 9 && str.length < 13
			? 9
			: str.length > 13
			? 13
			: 0;

	if (n === 0) return kor[str];

	const first = "1" + str.substr(str.substr(0, n).length);
	const second = str.substr(0, n);

	return kor[first] + (p.indexOf(kor[second]) >= 0 ? "" : kor[second]);
};

// Convert numbers to Korean characters
const numToKorean = (num) =>
	separateNums(num)
		.reverse()
		.reduce((merged, x, ix) => {
			const nTimesMuliplier = nNimes(ix + 1);

			const secondPart =
				nTimesMuliplier > 1 && x > 0
					? getNumberBetween(nTimesMuliplier, x, merged.join(""))
					: "";

			const firstPart =
				x > 1 ||
				(x > 0 && ix === 0) ||
				["100000000", "1000000000000"].indexOf(nTimesMuliplier) >= 0
					? kor[x]
					: "";

			if (`${firstPart}${secondPart}`)
				merged.push(`${firstPart}${secondPart}`);

			return merged;
		}, [])
		.reverse()
		.filter((i) => i)
		.join("");

// Convert Korean caracters into number
const charToNum = (str) => {
	let sum = 0,
		leftMultiplier = 1,
		rightMultiplier = 1;

	const table = Array.from(str)
		.map((p) => swapKeyValue(kor)[p])
		.reverse();

	for (let i = 0; i < table.length; i++) {
		let curent = table[i] * 1,
			next = table[i + 1] * 1,
			cursor = curent >= 10 ? 0 : 1;

		if (curent > leftMultiplier && !cursor) {
			// set left multiplier
			leftMultiplier = curent;
			rightMultiplier = 1;
		} else if (curent < leftMultiplier && curent >= 10 && !cursor) {
			// set right multiplier
			rightMultiplier = curent;
		}

		if (cursor) {
			// when pointing at number < 10
			sum += curent * leftMultiplier * rightMultiplier;
		} else if (next > curent || i === table.length - 1) {
			// when pointing at number which not have parentheses one step ahead
			sum += curent !== leftMultiplier ? curent * leftMultiplier : curent;
		} else if (table.length === 1) {
			// when number >= 10 and array.length = 1
			sum += curent;
		}
	}

	return sum;
};

// start point
const initialize = (args) => {
	// vaidate input - allow nnumbers or korean letters
	if (
		args.length !== 2 ||
		args.find((val) => !/^[0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(val))
	) {
		console.log(
			"Input must be the pair of 2 integers OR 2 korean characters\n"
		);
		return false;
	}

	// convert characters to number
	const summed = /\d/.test(args[0])
		? argsIntAddition(args)
		: argsCharsAddition(args);

	// console.log(summed); // print number

	const korean = numToKorean(summed);

	// korean letter counting output
	console.log(korean);

	// convert characters to number AGAIN (double check)
	// console.log(charToNum(korean));

	return korean;
};

initialize(process.argv.slice(2));

// const loop = [
// 	["오백삼십조칠천팔백구십만천오백삼십구", "삼조사천이만삼천구"],
// 	["육십사억삼천십팔만칠천육백구", "사십삼"],
// 	[
// 		"구백육십조칠천억팔천백삼십이만칠천일",
// 		"사십삼조오천이백억육천구백십만일",
// 	],
// 	[
// 		"이천구백육십조천오백칠십만삼천구백구십",
// 		"삼천사백오십조일억이천만육백사십삼",
// 	],
// 	["사십오억삼천육십만오백구십", "칠십억천이백삼십오만칠천구십이"],
// 	["천백십일", "구천오백구십구"],
// 	["오억사천", "백십일"],
// 	["만오천사백삼십", "십구만삼천오백"],
// 	["일조", "삼"],
// 	["일억", "만"],
// ];

// const check = [
// 	"오백삼십삼조일억천팔백구십이만사천오백사십팔",
// 	"육십사억삼천십팔만칠천육백오십이",
// 	"천사조이천이백일억오천사십이만칠천이",
// 	"육천사백십조일억삼천오백칠십만사천육백삼십삼",
// 	"백십오억사천이백구십오만칠천육백팔십이",
// 	"만칠백십",
// 	"오억사천백십일",
// 	"이십만팔천구백삼십",
// 	"일조삼",
// 	"일억일만",
// ];

// loop.map((i, ix) => {
// 	const out = initialize(i);
// 	console.log(out, out === check[ix], check[ix]);
// 	console.log("----------------------------");
// 	return false;
// });
