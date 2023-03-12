// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::num::ParseIntError;
use chess_engine::{Evaluate, BoardBuilder, Board, Piece, Position, Color, Move};

fn pos(file: char, rank: char) -> Position {
    let position = file.to_string() + &rank.to_string();
    if position == "a1" { return chess_engine::A1; }
    else if position == "a2" { return chess_engine::A2; }
    else if position == "a3" { return chess_engine::A3; }
    else if position == "a4" { return chess_engine::A4; }
    else if position == "a5" { return chess_engine::A5; }
    else if position == "a6" { return chess_engine::A6; }
    else if position == "a7" { return chess_engine::A7; }
    else if position == "a8" { return chess_engine::A8; }
    else if position == "b1" { return chess_engine::B1; }
    else if position == "b2" { return chess_engine::B2; }
    else if position == "b3" { return chess_engine::B3; }
    else if position == "b4" { return chess_engine::B4; }
    else if position == "b5" { return chess_engine::B5; }
    else if position == "b6" { return chess_engine::B6; }
    else if position == "b7" { return chess_engine::B7; }
    else if position == "b8" { return chess_engine::B8; }
    else if position == "c1" { return chess_engine::C1; }
    else if position == "c2" { return chess_engine::C2; }
    else if position == "c3" { return chess_engine::C3; }
    else if position == "c4" { return chess_engine::C4; }
    else if position == "c5" { return chess_engine::C5; }
    else if position == "c6" { return chess_engine::C6; }
    else if position == "c7" { return chess_engine::C7; }
    else if position == "c8" { return chess_engine::C8; }
    else if position == "d1" { return chess_engine::D1; }
    else if position == "d2" { return chess_engine::D2; }
    else if position == "d3" { return chess_engine::D3; }
    else if position == "d4" { return chess_engine::D4; }
    else if position == "d5" { return chess_engine::D5; }
    else if position == "d6" { return chess_engine::D6; }
    else if position == "d7" { return chess_engine::D7; }
    else if position == "d8" { return chess_engine::D8; }
    else if position == "e1" { return chess_engine::E1; }
    else if position == "e2" { return chess_engine::E2; }
    else if position == "e3" { return chess_engine::E3; }
    else if position == "e4" { return chess_engine::E4; }
    else if position == "e5" { return chess_engine::E5; }
    else if position == "e6" { return chess_engine::E6; }
    else if position == "e7" { return chess_engine::E7; }
    else if position == "e8" { return chess_engine::E8; }
    else if position == "f1" { return chess_engine::F1; }
    else if position == "f2" { return chess_engine::F2; }
    else if position == "f3" { return chess_engine::F3; }
    else if position == "f4" { return chess_engine::F4; }
    else if position == "f5" { return chess_engine::F5; }
    else if position == "f6" { return chess_engine::F6; }
    else if position == "f7" { return chess_engine::F7; }
    else if position == "f8" { return chess_engine::F8; }
    else if position == "g1" { return chess_engine::G1; }
    else if position == "g2" { return chess_engine::G2; }
    else if position == "g3" { return chess_engine::G3; }
    else if position == "g4" { return chess_engine::G4; }
    else if position == "g5" { return chess_engine::G5; }
    else if position == "g6" { return chess_engine::G6; }
    else if position == "g7" { return chess_engine::G7; }
    else if position == "g8" { return chess_engine::G8; }
    else if position == "h1" { return chess_engine::H1; }
    else if position == "h2" { return chess_engine::H2; }
    else if position == "h3" { return chess_engine::H3; }
    else if position == "h4" { return chess_engine::H4; }
    else if position == "h5" { return chess_engine::H5; }
    else if position == "h6" { return chess_engine::H6; }
    else if position == "h7" { return chess_engine::H7; }
    else if position == "h8" { return chess_engine::H8; }

    return chess_engine::A1;
}

fn piece_gen(c: char, file: char, rank: char) -> Piece {
    let position = pos(file, rank);
    if c == 'r' { return Piece::Rook(Color::Black, position) }
    else if c == 'R' { return Piece::Rook(Color::White, position) }
    else if c == 'n' { return Piece::Knight(Color::Black, position) }
    else if c == 'N' { return Piece::Knight(Color::White, position) }
    else if c == 'b' { return Piece::Bishop(Color::Black, position) }
    else if c == 'B' { return Piece::Bishop(Color::White, position) }
    else if c == 'q' { return Piece::Queen(Color::Black, position) }
    else if c == 'Q' { return Piece::Queen(Color::White, position) }
    else if c == 'k' { return Piece::King(Color::Black, position) }
    else if c == 'K' { return Piece::King(Color::White, position) }
    else if c == 'p' { return Piece::Pawn(Color::Black, position) }
    else if c == 'P' { return Piece::Pawn(Color::White, position) }
    return Piece::Pawn(Color::White, position);
}

fn board_from_fen(fen: &str) -> Board {
    let files = vec!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let ranks = vec!['8', '7', '6', '5', '4', '3', '2', '1'];

    let mut board_builder = BoardBuilder::from(Board::empty());

    let mut file_index = 0;
    let mut file = files[file_index];

    let mut rank_index = 0;
    let mut rank = ranks[rank_index];

    for c in fen.chars() {
        let raw_skip: Result<usize, ParseIntError> = c.to_string().parse();
        if let Ok(skip) = raw_skip {
            file_index += skip;
            file = *files.get(file_index).unwrap_or(&'a');
            continue;
        }
        if c == '/' {
            rank_index += 1;
            rank = ranks[rank_index];
            file_index = 0;
            file = files[file_index];
            continue;
        }

        board_builder = board_builder.piece(piece_gen(c, file, rank));
    }

    board_builder.build()
}

fn format_move(m: Move) -> String {
    match m {
        Move::KingSideCastle => String::from("OO"),
        Move::QueenSideCastle => String::from("OOO"),
        Move::Piece(x, y) => String::from(
            x.get_row().to_string() + &x.get_col().to_string() +
            " " + &y.get_row().to_string() + &y.get_col().to_string()
        ),
        Move::Resign => String::from("shit")
    }
}

#[tauri::command]
fn evaluate(fen: &str) -> (String, u64, f64) {
    let board = board_from_fen(fen);
    let eval = Evaluate::get_best_next_move(&board, 18);
    (format_move(eval.0), eval.1, eval.2)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![evaluate])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
