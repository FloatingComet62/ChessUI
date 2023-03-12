<script lang="ts">
  import { Color, fileToInt, Piece } from "../util";

  export let file: string;
  export let rank: string;
  export let color: Color;
  export let piece: Piece;
  export let moveable: boolean;
  export let darkColor: string;
  export let lightColor: string;
  export let highlightColor: string;
  export let moveColor: string;
  export let ballColor: string;
  export let setHP: (
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    },
    p: Piece,
    file: number,
    rank: number
  ) => void;
  export let getHP: () => Piece;
  export let updateBoard: (
    move: string,
    piece: Piece,
    unChose: () => void
  ) => void;
  export let moved: () => void;

  let choosen = false;
  let highlighted = false;

  function unChose() {
    choosen = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="cell"
  style={`background-color: ${
    color == Color.DARK ? darkColor : lightColor
  }; color: ${color == Color.DARK ? lightColor : lightColor}; ${
    highlighted ? `background-color: ${highlightColor}` : ""
  }; ${choosen ? `background-color: ${moveColor}` : `""`};`}
  unselectable="on"
  id={file + rank}
  on:click={(e) => {
    if (!choosen && !moveable && getHP() != Piece.None) return;
    if (moveable) moved();

    if (piece == Piece.None) {
      // placing a piece on blank
      piece = getHP();
      setHP(e, Piece.None, fileToInt(file), parseInt(rank));
    } else {
      if (getHP() != Piece.None) {
        // capture
        piece = getHP();
        setHP(e, Piece.None, fileToInt(file), parseInt(rank));
      } else {
        setHP(e, piece, fileToInt(file), parseInt(rank));
        piece = Piece.None;
      }
    }
    if (getHP() != Piece.None) choosen = true;

    // Promotion check
    if (parseInt(rank) == 8 && piece == Piece.W_PAWN) piece = Piece.W_QUEEN;
    if (parseInt(rank) == 1 && piece == Piece.B_PAWN) piece = Piece.B_QUEEN;

    updateBoard(file + rank, piece, unChose);
  }}
  on:mouseup={(e) => {
    if (e.button == 2) {
      highlighted = !highlighted;
    }
  }}
>
  <div unselectable="on" class="label">{file + rank}</div>
  {#if piece != Piece.None}
    <img unselectable="on" src={`/${piece}.png`} alt={piece} />
  {/if}
  {#if moveable}
    <div id="moveable_ball" style={`background-color: ${ballColor}5e`} />
  {/if}
</div>

<style>
  .cell {
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
  }
  .label {
    position: absolute;
    opacity: 50%;
  }
  #moveable_ball {
    position: absolute;
    align-self: center;
    width: 20px;
    height: 20px;
    border-radius: 32rem;
  }
  img {
    place-self: center;
    width: 50px;
    height: 50px;
  }
</style>
