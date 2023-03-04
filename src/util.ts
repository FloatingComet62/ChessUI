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

export function fillMissing(obj: Object): Object {
  for (const rank of ranks)
    for (const file of files)
      if (!obj.hasOwnProperty(file + rank))
        obj[file + rank] = Piece.None
  return obj;
}

function fenCharToPiece(char: string): Piece {
  if (char == "r") return Piece.B_ROOK
  if (char == "n") return Piece.B_KNIGHT
  if (char == "b") return Piece.B_BISHOP
  if (char == "q") return Piece.B_QUEEN
  if (char == "k") return Piece.B_KING
  if (char == "p") return Piece.B_PAWN

  if (char == "R") return Piece.W_ROOK
  if (char == "N") return Piece.W_KNIGHT
  if (char == "B") return Piece.W_BISHOP
  if (char == "Q") return Piece.W_QUEEN
  if (char == "K") return Piece.W_KING
  if (char == "P") return Piece.W_PAWN
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
      fileIndex = fileToInt(file) + skip
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