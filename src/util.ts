export enum Color {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum Piece {
  None = 'X',

  B_PAWN = 'bp',
  B_ROOK = 'br',
  B_KNIGHT = 'bn',
  B_BISHOP = 'bb',
  B_QUEEN = 'bq',
  B_KING = 'bk',

  W_PAWN = 'wp',
  W_ROOK = 'wr',
  W_KNIGHT = 'wn',
  W_BISHOP = 'wb',
  W_QUEEN = 'wq',
  W_KING = 'wk'
}
export enum Player {
  WHITE = 'w',
  BLACK = 'b'
}
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();
export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const fenMap = {
  "r": Piece.B_ROOK,
  "n": Piece.B_KNIGHT,
  "b": Piece.B_BISHOP,
  "q": Piece.B_QUEEN,
  "k": Piece.B_KING,
  "p": Piece.B_PAWN,
  "R": Piece.W_ROOK,
  "N": Piece.W_KNIGHT,
  "B": Piece.W_BISHOP,
  "Q": Piece.W_QUEEN,
  "K": Piece.W_KING,
  "P": Piece.W_PAWN
}

export function fillMissing(obj: Object): Object {
  for (const rank of ranks)
    for (const file of files)
      if (!obj.hasOwnProperty(file + rank))
        obj[file + rank] = Piece.None
  return obj;
}

function fenCharToPiece(char: string): Piece {
  if (fenMap[char]) return fenMap[char]
  return Piece.None
}

export function fileToInt(file: string): number {
  if (file == "a") return 0;
  if (file == "b") return 1;
  if (file == "c") return 2;
  if (file == "d") return 3;
  if (file == "e") return 4;
  if (file == "f") return 5;
  if (file == "g") return 6;
  if (file == "h") return 7;
  return 0;
}

export function FENtoBoard(fen: string): Object {
  const board = fillMissing({});

  let fileIndex = 0;
  let file = files[fileIndex];

  let rankIndex = 0;
  let rank = ranks[rankIndex];

  for (const c of fen.split('')) {
    const skip = parseInt(c);
    if (skip) {
      fileIndex += skip
      file = files[fileIndex];
      continue;
    }
    if (c == "/") {
      rankIndex++;
      rank = ranks[rankIndex];
      fileIndex = 0;
      file = files[fileIndex];
      continue;
    }
    const piece = fenCharToPiece(c);
    board[file + rank] = piece;

    fileIndex++;
    file = files[fileIndex];
  }

  return board;
}

export function getKeyByValue(object: Object, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}

export function boardToFen(board: Object): string {
  let fen = "";

  let currentRank = '8';
  let currentSkip = 0;
  const a_board = Object.entries(board);
  let i = 0;
  for (i = 0; i < a_board.length; i++) {
    const [key, value] = a_board[i];
    const rank = key[1];
    if (currentRank != rank) {
      if (currentSkip) {
        fen += currentSkip.toString();
        currentSkip = 0;
      }
      currentRank = rank;
      fen += "/";
    }
    const p = getKeyByValue(fenMap, value);
    if (p) {
      if (currentSkip) {
        fen += currentSkip.toString();
        currentSkip = 0;
      }
      fen += p;
    } else {
      currentSkip += 1;
    }
  }

  if (currentSkip) fen += currentSkip.toString();

  return fen;
}