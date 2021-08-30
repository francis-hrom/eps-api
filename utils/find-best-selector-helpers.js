// ? hwo to run all of this inside puppeteer browser context

function findNodesByText(text) {
  if (typeof text !== 'string') throw new Error(`${text} is not a string.`);
  if (!text) throw new Error(`${text} is empty.`);

  const nodeList = document.querySelectorAll('*');
  if (nodeList.length === 0) throw new Error('NodeList is empty.');

  const nodes = [];
  nodeList.forEach((node) => {
    const innerText = node.innerText;
    // if (innerText) {
    if (innerText.toLowerCase() === text.toLowerCase()) {
      nodes.push(node);
    }
    //}
  });

  return nodes;
}

function generateSelector(node) {
  if (!node) throw new Error(`${node} is not a valid input.`);

  let index, pathSelector, localName;
  index = getIndex(node);

  while (node.tagName) {
    pathSelector = node.localName + (pathSelector ? '>' + pathSelector : '');
    node = node.parentNode;
  }

  if (index) {
    return pathSelector + `:nth-of-type(${index})`;
  }

  return pathSelector;
}

// get index for nth of type element
function getIndex(node) {
  let i = 1;
  let tagName = node.tagName;

  while (node.previousSibling) {
    node = node.previousSibling;
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
      i++;
    }
  }
  return i;
}

function getMostFrequent(arr) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) =>
    hashmap[a] > hashmap[b] ? a : b
  );
}

function findBestSelector(textArr) {
  if (!Array.isArray(textArr)) {
    throw new TypeError(`${textArr} is not an array`);
  }
  if (textArr.length === 0) {
    throw new Error(`${textArr} is empty.`);
  }

  const selectors = [];
  textArr.forEach((text) => {
    const nodes = findNodesByText(text);
    nodes.forEach((node) => selectors.push(generateSelector(node)));
  });

  return selectors.length ? getMostFrequent(selectors) : null;
}
