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
    getKeyByValue,
  } from "./util";
  import { gen_moves, getTeam, generatePseudoResponses } from "./chess";

  export let initialPos: string;
  export let darkColor: string;
  export let lightColor: string;
  export let highlightColor: string;
  export let moveColor: string;
  export let ballColor: string;

  const history = [];
  const initialPosition = initialPos.split(" ");

  let board = FENtoBoard(initialPosition[0]);
  history.push(initialPosition[0] + " " + initialPosition[1]);
  let castling = initialPosition[1].split("");
  let castling_data = [
    [Piece.W_KING, Piece.W_ROOK, "1", "K", "Q"],
    [Piece.B_KING, Piece.B_ROOK, "8", "k", "q"],
  ];
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
    } else {
      for (const [
        moved_piece,
        friend_rook,
        back_rank,
        KingSide_Notation,
        QueenSide_Notation,
      ] of castling_data) {
        if (piece == moved_piece) {
          if (from == "e" + back_rank && to == "g" + back_rank) {
            board["h" + back_rank] = Piece.None;
            board["f" + back_rank] = friend_rook;
          } else if (from == "e" + back_rank && to == "c" + back_rank) {
            board["a" + back_rank] = Piece.None;
            board["d" + back_rank] = friend_rook;
          }
        }
        castling = castling.filter(
          (l) => l != QueenSide_Notation || l != KingSide_Notation
        );
      }
    }
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
        const friends = getTeam(board, to_move, false);
        const our_response = generatePseudoResponses(board, castling, friends);

        if (our_response.length == 0) {
          // checkmate or stalemate
          const our_king = getKeyByValue(
            board,
            to_move == "w" ? Piece.W_KING : Piece.B_KING
          );

          // generate new moves
          const enemies = getTeam(board, to_move, true);
          const responses = generatePseudoResponses(board, castling, enemies);

          // if any of them capture our king, it's checkmate
          if (responses.includes(our_king)) {
            message = "Checkmate!";
          } else {
            message = "Stalemate!";
          }
        }
      }

      // don't castle if in check
      if (p[1] == "k") {
        const enemies = getTeam(board, to_move, true);
        const responses = generatePseudoResponses(enemies, castling, enemies);
        const castling_rank = p[0] == "w" ? "1" : "8";
        const king_pos = getKeyByValue(
          board,
          to_move == "w" ? Piece.W_KING : Piece.B_KING
        );
        if (responses.includes(king_pos)) {
          moves = moves.filter(
            (move) => move != "g" + castling_rank && move != "c" + castling_rank
          );
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

  function copy_fen() {
    navigator.clipboard.writeText(
      `${boardToFen(board)} ${castling.join("")} ${to_move}`
    );
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
  <!-- {#await move}
    <p>...waiting</p>
  {:then move_to_show}
    <p>{move_to_show}</p>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await} -->
  <section class="content">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section class="buttons">
      <div class="button" on:click={undo}>
        <img src="/undo.svg" alt="undo" />
      </div>
      <div class="button" on:click={do_flip}>
        <img src="/flip.svg" alt="Flip" />
      </div>
      <div class="button" on:click={copy_fen}>
        <img src="/copy.svg" alt="Flip" />
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
              {darkColor}
              {lightColor}
              {highlightColor}
              {ballColor}
              {moveColor}
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
              {darkColor}
              {lightColor}
              {highlightColor}
              {moveColor}
              {ballColor}
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
