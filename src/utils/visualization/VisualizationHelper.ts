//* Basic Math Helper Functions
export function NumberRangeLimit(input: number, min: number, max: number) {
  return Math.min(Math.max(input, min), max);
}

export function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

//* Visualization Data Helper Functions

export function smoothInterpolation(data: Uint8Array, easing = easeInOutSine) {
  let halfwayPoint = Math.floor(data.length / 4);
  let firstHalf = data.slice(0, halfwayPoint * 3);
  let secondHalf = data.slice(halfwayPoint * 3);

  let output = [];
  let group = [firstHalf[0]];

  for (let i = 1; i < firstHalf.length; i++) {
    if (firstHalf[i] !== group[0]) {
      if (group[0] === 0) {
        output.push(...group);
      } else {
        let step = 1 / group.length;
        let difference = firstHalf[i] - group[0];

        for (let j = 0; j < group.length; j++) {
          let value = group[0] + difference * easing(step * j);
          output.push(value);
        }
      }

      group = [firstHalf[i]];
    } else {
      group.push(firstHalf[i]);
    }
  }

  for (let j = 0; j < group.length; j++) {
    let value = group[0];
    output.push(value);
  }

  return new Uint8Array([...output, ...secondHalf]);
}

export function logarithmicReturn(data: Uint8Array) {
  let temp = [];
  let length = data.length;
  let maxLog = Math.log(length);
  let step = maxLog / length;

  for (let i = 0; i < length; i++) {
    let dataIndex = Math.floor(Math.exp(step * i));

    temp.push(data[dataIndex]);
  }

  return new Uint8Array(temp);
}

export function FrequencyAverage(
  data: Uint8Array,
  minindex: number,
  maxindex: number
) {
  const portion = data.slice(minindex, maxindex);
  let sum: number = 0;
  let avg: number = 0;

  for (let i = 0; i < portion.length; i++) {
    sum += portion[i];
  }
  avg = sum / portion.length;

  return avg;
}

export function FrequencyThreshold(
  input: number,
  threshold: number,
  type: string = "frequencydata"
) {
  let value: number = 0;

  switch (type.toLowerCase()) {
    case "frequencydata":
      if (input >= threshold) {
        value = input;
      }

      break;
    case "timedomaindata":
      if (input <= threshold) {
        value = input;
      }

      break;
  }

  return value;
}

export function HasHitFrequencyThreshold(
  input: number,
  threshold: number,
  type: string = "frequencydata"
) {
  let value: boolean = false;

  switch (type.toLowerCase()) {
    case "frequencydata":
      if (input >= threshold) {
        value = true;
      }

      break;
    case "timedomaindata":
      if (input <= threshold) {
        value = true;
      }

      break;
  }

  return value;
}
