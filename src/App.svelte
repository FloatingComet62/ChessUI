<script lang="ts">
  import Cell from "./lib/Cell.svelte";
  import {
    Color,
    ranks,
    files,
    Piece,
    FENtoBoard,
    Player,
    boardToFen,
    fileToInt,
    getKeyByValue,
  } from "./util";
  import { gen_moves, pseudo_moves } from "./chess";

  const history = [];
  let all_moves = "";
  const initialPosition =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq w".split(" ");

  let board = FENtoBoard(initialPosition[0]);
  history.push(initialPosition[0] + " " + initialPosition[1]);
  let castling = initialPosition[1].split("");
  let moving_piece = Piece.None;
  let from = "";
  let message = "";
  let flip = false;
  let to_move: Player = initialPosition[2] == "w" ? Player.WHITE : Player.BLACK;

  let hoveringPiece = Piece.None;
  let hoveringDiv: any;
  let un_choose: () => void;
  let moves: string[] = [];
  function onMove(piece: Piece, from: string, to: string) {
    // check if a castling rook got yeeted
    if (to == "a1") castling = castling.filter((l) => l !== "Q");
    if (to == "h1") castling = castling.filter((l) => l !== "K");
    if (to == "a8") castling = castling.filter((l) => l !== "q");
    if (to == "h8") castling = castling.filter((l) => l !== "k");

    if (piece == Piece.W_ROOK) {
      if (from == "a1") castling = castling.filter((l) => l !== "Q");
      if (from == "h1") castling = castling.filter((l) => l !== "K");
    } else if (piece == Piece.B_ROOK) {
      if (from == "a8") castling = castling.filter((l) => l !== "q");
      if (from == "h8") castling = castling.filter((l) => l !== "k");
    } else if (piece == Piece.W_KING) {
      // K
      if (from == "e1" && to == "g1") {
        board["h1"] = Piece.None;
        board["f1"] = Piece.W_ROOK;
      }
      // Q
      else if (from == "e1" && to == "c1") {
        board["a1"] = Piece.None;
        board["d1"] = Piece.W_ROOK;
      }
      // you lose castling rights because you moved and didn't castled
      // or you just castled
      castling = castling.filter((l) => {
        if (l == "Q") return false;
        if (l == "K") return false;
        return true;
      });
    } else if (piece == Piece.B_KING) {
      // k
      if (from == "e8" && to == "g8") {
        board["h8"] = Piece.None;
        board["f8"] = Piece.B_ROOK;
      }
      // q
      else if (from == "e8" && to == "c8") {
        board["a8"] = Piece.None;
        board["d8"] = Piece.B_ROOK;
      }
      // you lose castling rights because you moved and didn't castled
      // or you just castled
      castling = castling.filter((l) => {
        if (l == "q") return false;
        if (l == "k") return false;
        return true;
      });
    }
    all_moves += " " + from + to;
  }
  function setHoveringPiece(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    },
    p: Piece,
    file: number,
    rank: number
  ) {
    hoveringPiece = p;
    hoveringDiv.style.cssText = `display: block;
      left: ${e.pageX - 25}px;
      top: ${e.pageY - 25}px`;
    if (to_move == p[0]) {
      moving_piece = p;
      from = files[file] + rank.toString();
      moves = gen_moves(board, castling, p, file, rank);
      if (moves.length == 0) {
        // generate our moves
        const our_new_moves = [];
        const friends = {};
        Object.keys(board).reduce((_, key) => {
          if (board[key][0] == to_move) friends[key] = board[key];
          return key;
        });
        for (const [key, value] of Object.entries(friends)) {
          const file = fileToInt(key[0]);
          const rank = parseInt(key[1]);
          const e_moves = gen_moves(
            board,
            castling,
            value as Piece,
            file,
            rank
          );
          for (const e_move of e_moves) our_new_moves.push(e_move);
        }

        if (our_new_moves.length == 0) {
          // checkmate or stalemate

          const our_king = getKeyByValue(
            board,
            to_move == "w" ? Piece.W_KING : Piece.B_KING
          );

          // generate new moves
          const new_moves = [];
          const enemies = {};
          Object.keys(board).reduce((_, key) => {
            if (board[key][0] == (to_move == "w" ? "b" : "w"))
              enemies[key] = board[key];
            return key;
          });
          for (const [key, value] of Object.entries(enemies)) {
            const file = fileToInt(key[0]);
            const rank = parseInt(key[1]);
            const e_moves = gen_moves(
              board,
              castling,
              value as Piece,
              file,
              rank
            );
            for (const e_move of e_moves) new_moves.push(e_move);
          }

          // if any of them capture our king, it's checkmate
          if (new_moves.includes(our_king)) {
            message = "Checkmate!";
          } else {
            message = "Stalemate!";
          }
        }
      }
    }
    if (hoveringPiece == Piece.None) {
      if (moving_piece != Piece.None) {
        const to = files[file] + rank.toString();
        if (from != to)
          onMove(moving_piece, from, files[file] + rank.toString());
        from = "";
        moving_piece = Piece.None;
      }
      moves = [];
      un_choose();
    }
  }
  function getHoveringPiece(): Piece {
    return hoveringPiece;
  }
  function updateBoard(move: string, piece: Piece, unChose: () => void) {
    board[move] = piece;
    un_choose = unChose;

    // update history
    const new_fen = boardToFen(board);
    if (
      hoveringPiece == Piece.None &&
      history[history.length - 1].split(" ")[0] != new_fen
    )
      history.push(new_fen + " " + castling.join(""));
    console.log(history);
  }
  function moved() {
    if (to_move == Player.WHITE) to_move = Player.BLACK;
    else to_move = Player.WHITE;
  }

  function undo() {
    history.pop();
    const data = history[history.length - 1];
    if (data) {
      const [new_board, new_castling] = data.split(" ");
      board = FENtoBoard(new_board);
      castling = new_castling.split("");
      moved();
    } else history.push(boardToFen(board) + " " + castling.join(""));
    message = "";
  }

  function do_flip() {
    flip = !flip;
  }

  document.onmousemove = (event) => {
    if (hoveringDiv)
      hoveringDiv.style.cssText = `display: block;
      left: ${event.pageX - 25}px;
      top: ${event.pageY - 25}px`;
  };
  window.oncontextmenu = () => false;
</script>

<main>
  <caption>{message}</caption>
  <section class="content">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section class="buttons">
      <div class="button" on:click={undo}>
        <img src="/undo.svg" alt="undo" />
      </div>
      <div class="button" on:click={do_flip}>
        <img src="/flip.svg" alt="Flip" />
      </div>
    </section>
    <section id="container">
      {#if flip}
        {#each ranks.slice().reverse() as rank, i}
          {#each files.slice().reverse() as file, j}
            <Cell
              color={(i + j) % 2 == 0 ? Color.LIGHT : Color.DARK}
              {file}
              {rank}
              moveable={moves.includes(file + rank)}
              piece={board[file + rank]}
              setHP={setHoveringPiece}
              getHP={getHoveringPiece}
              {updateBoard}
              {moved}
            />
          {/each}
        {/each}
      {:else}
        {#each ranks as rank, i}
          {#each files as file, j}
            <Cell
              color={(i + j) % 2 == 0 ? Color.LIGHT : Color.DARK}
              {file}
              {rank}
              moveable={moves.includes(file + rank)}
              piece={board[file + rank]}
              setHP={setHoveringPiece}
              getHP={getHoveringPiece}
              {updateBoard}
              {moved}
            />
          {/each}
        {/each}
      {/if}
    </section>
  </section>
  <div class="hovering" bind:this={hoveringDiv}>
    {#if hoveringPiece != Piece.None}
      <img src={`${hoveringPiece}.png`} alt={`${hoveringPiece}`} />
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  caption {
    font-size: larger;
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
  }
  #container {
    display: grid;
    /* 8 x 8 grid */
    grid-template:
      "a b c d e f g h"
      "i j k l m n o p"
      "q r s t u v w x"
      "y z A B C D E F"
      "G H I J K L M N"
      "O P Q R S T U V"
      "W X Y Z 1 2 3 4";
    grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px;
    grid-template-rows: 70px 70px 70px 70px 70px 70px 70px 70px;
  }
  .hovering {
    display: none;
    position: absolute;
    left: 25px;
    top: 25px;
    z-index: 10;
    pointer-events: none; /* to allow clicking through the hovering piece */
  }
  .hovering > img {
    width: 50px;
    height: 50px;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  .button {
    cursor: pointer;
    background-color: #7fa650;
    width: 50px;
    height: 50px;
    padding: 0.5rem;
    border-radius: 0.5rem;
    align-self: center;
    display: grid;
    place-items: center;
  }
  .button > img {
    width: 25px;
    height: 25px;
  }
</style>
