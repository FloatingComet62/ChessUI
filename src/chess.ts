import { Piece, files, fileToInt, getKeyByValue } from "./util";

export function king(piece: Piece, castling: string[], board: Object, file: number, rank: number): string[] {
  const valid_moves: string[] = [];

  for (const i of [-1, 0, 1])
    for (const j of [-1, 0, 1]) {
      const f = files[(file + i)]
      const r = (rank + j).toString()
      if (!f) continue;
      if (rank + j > 8 || rank + j <= 0) continue;
      const move = f + r;
      if (board[move][0] == piece[0]) continue;
      valid_moves.push(move);
    }

  if (castling.includes("K") && piece == Piece.W_KING)
    if (board['f1'] == Piece.None && board['g1'] == Piece.None)
      valid_moves.push("g1");
  if (castling.includes("Q") && piece == Piece.W_KING)
    if (board['b1'] == Piece.None && board['c1'] == Piece.None && board['d1'] == Piece.None)
      valid_moves.push("c1");
  if (castling.includes("k") && piece == Piece.B_KING)
    if (board['f8'] == Piece.None && board['g8'] == Piece.None)
      valid_moves.push("g8");
  if (castling.includes("q") && piece == Piece.B_KING)
    if (board['b8'] == Piece.None && board['c8'] == Piece.None && board['d8'] == Piece.None)
      valid_moves.push("c8");

  return valid_moves;
}

export function bishop(piece: Piece, board: Object, file: number, rank: number): string[] {
  const valid_moves: string[] = [];

  for (const i of [1, -1])
    for (const j of [1, -1])
      for (const k of [1, 2, 3, 4, 5, 6, 7]) {
        const f = files[(file + i * k)]
        const r = (rank + j * k).toString()
        if (!f) continue;
        if (rank + j * k > 8 || rank + j * k <= 0) continue;
        const move = f + r;
        if (board[move] == Piece.None) {
          valid_moves.push(f + r);
          continue;
        }
        if (board[move][0] == piece[0]) break;
        else {
          valid_moves.push(f + r);
          break;
        }
      }

  return valid_moves;
}

export function rook(piece: Piece, board: Object, file: number, rank: number): string[] {
  const valid_moves: string[] = [];

  for (const i of [1, -1])
    for (const k of [1, 2, 3, 4, 5, 6, 7]) {
      const f = files[(file + i * k)]
      const r = rank.toString()
      if (!f) continue;
      const move = f + r;
      if (board[move] == Piece.None) {
        valid_moves.push(f + r);
        continue;
      }
      if (board[move][0] == piece[0]) break;
      else {
        valid_moves.push(f + r);
        break;
      }
    }
  for (const i of [1, -1])
    for (const k of [1, 2, 3, 4, 5, 6, 7]) {
      const f = files[file]
      const r = (rank + i * k).toString()
      if (rank + i * k > 8 || rank + i * k <= 0) continue;
      const move = f + r;
      if (board[move] == Piece.None) {
        valid_moves.push(f + r);
        continue;
      }
      if (board[move][0] == piece[0]) break;
      else {
        valid_moves.push(f + r);
        break;
      }
    }

  return valid_moves;
}

export function pawn(piece: Piece, board: Object, file: number, rank: number): string[] {
  const valid_moves: string[] = []

  if (piece[0] == 'w' && rank == 2 && board[files[file] + (rank + 1).toString()] == Piece.None) {
    const cool_move = files[file] + (rank + 2).toString();
    if (board[cool_move] == Piece.None)
      valid_moves.push(cool_move)
  } else if (piece[0] == 'b' && rank == 7 && board[files[file] + (rank - 1).toString()] == Piece.None) {
    const cool_move = files[file] + (rank - 2).toString();
    if (board[cool_move] == Piece.None)
      valid_moves.push(cool_move)
  }

  const direction = piece[0] == 'w' ? 1 : -1;
  const move = files[file] + (rank + direction).toString();
  if (rank + direction <= 8 && rank + direction > 0) {
    if (board[move] == Piece.None && board[move][0] != piece[0]) {
      valid_moves.push(move);
    }
  }

  const f_attack1 = files[file + 1];
  const r_attack1 = (rank + direction).toString();
  if (f_attack1 && (rank < 8 && rank > 1)) {
    const attack1 = f_attack1 + r_attack1
    if (board[attack1][0] == (piece[0] == 'w' ? 'b' : 'w')) {
      valid_moves.push(attack1);
    }
  }

  const f_attack2 = files[file - 1];
  const r_attack2 = (rank + direction).toString();
  if (f_attack2 && (rank < 8 && rank > 1)) {
    const attack2 = f_attack2 + r_attack2
    if (board[attack2][0] == (piece[0] == 'w' ? 'b' : 'w')) {
      valid_moves.push(attack2);
    }
  }

  return valid_moves;
}

export function knight(piece: Piece, board: Object, file: number, rank: number): string[] {
  const valid_moves: string[] = [];
  // top and bottom
  for (const i of [1, -1])
    for (const j of [1, -1]) {
      const f = files[file + j];
      const r = (rank + 2 * i).toString();

      if (!f) continue;
      if (rank + 2 * i > 8 || rank + 2 * i <= 0) continue;
      const move = f + r;
      if (board[move][0] == piece[0]) continue;
      valid_moves.push(move);
    }
  // left and right
  for (const i of [1, -1])
    for (const j of [1, -1]) {
      const f = files[file + 2 * j];
      const r = (rank + i).toString();

      if (!f) continue;
      if (rank + i > 8 || rank + i <= 0) continue;
      const move = f + r;
      if (board[move][0] == piece[0]) continue;
      valid_moves.push(move);
    }

  return valid_moves;
}

export function pseudo_moves(board: Object, castling: string[], piece: Piece, file: number, rank: number): string[] {
  if (piece == Piece.B_KING || piece == Piece.W_KING)
    return king(piece, castling, board, file, rank);
  if (piece == Piece.B_BISHOP || piece == Piece.W_BISHOP)
    return bishop(piece, board, file, rank);
  if (piece == Piece.B_ROOK || piece == Piece.W_ROOK)
    return rook(piece, board, file, rank);
  if (piece == Piece.B_PAWN || piece == Piece.W_PAWN)
    return pawn(piece, board, file, rank);
  if (piece == Piece.B_KNIGHT || piece == Piece.W_KNIGHT)
    return knight(piece, board, file, rank);
  if (piece == Piece.B_QUEEN || piece == Piece.W_QUEEN)
    return [
      ...rook(piece, board, file, rank),
      ...bishop(piece, board, file, rank),
    ]
  return [];
}

export function makeMove(board: Object, piece: Piece, from: string, to: string) {
  // check castling
  // K
  if (piece == Piece.W_KING && from == "e1" && to == "g1") {
    board['h1'] = Piece.None;
    board['f1'] = Piece.W_ROOK;
    // Q
  } else if (piece == Piece.W_KING && from == "e1" && to == "c1") {
    board['a1'] = Piece.None;
    board['d1'] = Piece.W_ROOK;
  }
  // k
  else if (piece == Piece.B_KING && from == "e8" && to == "g8") {
    board['h8'] = Piece.None;
    board['f8'] = Piece.B_ROOK;
    // Q
  } else if (piece == Piece.B_KING && from == "e8" && to == "c8") {
    board['a8'] = Piece.None;
    board['d8'] = Piece.B_ROOK;
  }

  board[from] = Piece.None;
  board[to] = piece;
}

export function gen_moves(board: Object, castling: string[], piece: Piece, file: number, rank: number): string[] {
  const valid_moves: string[] = [];
  const p_moves = pseudo_moves(board, castling, piece, file, rank);

  for (const p_move of p_moves) {
    const cloned_board = structuredClone(board);
    const castled_clone = [...castling];

    makeMove(cloned_board, piece, files[file] + rank.toString(), p_move);

    const our_king = getKeyByValue(cloned_board, piece[0] == 'w' ? Piece.W_KING : Piece.B_KING)

    // generate new moves
    const new_moves = [];
    const enemies = {};

    if (cloned_board['a8'][0] == (piece[0] == 'w' ? 'b' : 'w'))
      enemies['a8'] = cloned_board['a8']
    // due to the "previousValue" & "currentValue", this function below doesn't check
    // position a8, so i forcefully check it right above
    Object.keys(cloned_board).reduce((_, key) => {
      if (cloned_board[key][0] == (piece[0] == 'w' ? 'b' : 'w'))
        enemies[key] = cloned_board[key]
      return key;
    })
    for (const [key, value] of Object.entries(enemies)) {
      const file = fileToInt(key[0]);
      const rank = parseInt(key[1]);
      const e_moves = pseudo_moves(cloned_board, castled_clone, value as Piece, file, rank);
      for (const e_move of e_moves)
        new_moves.push(e_move);
    }

    console.log(board, enemies, piece)

    // if the move leads to the capture of our king, don't include it
    if (!new_moves.includes(our_king)) {
      valid_moves.push(p_move);
    }
  }

  return valid_moves;
}