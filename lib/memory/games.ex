defmodule Memory.Game do
  def new do
    %{
      tiles: initialize_tiles(),
      isHidden: initialize_hidden(),
			firstChoiceIndex: nil,
			disabled: false,
			score: 0,
			# used to animate hidden. if both are an index, then react
			# will call a function that will hide these two. if 
			# atleast one nil, nothing happens.
			hideOne: nil,
			hideTwo: nil,
    }
  end

  def client_view(game) do
    tileState = game.tiles
    hiddenState = game.isHidden
		disabled = game.disabled
		score = game.score
		hideOne = game.hideOne
		hideTwo = game.hideTwo
    %{
     	shown_tiles: shownTiles(tileState, hiddenState),
			disabled: disabled,
			score: score,
			hideOne: hideOne,
			hideTwo: hideTwo,
    }
  end

  def shownTiles(tiles, isHidden) do
		# goes through all indexes in tiles.
		# if the corresponding isHidden index is true, return "_"
		compareTileHidden(tiles, isHidden, [])
  end

	def compareTileHidden([tileHead | tileTail], isHidden, acc)  do
		[hiddenHead | hiddenTail] = isHidden
		if (hiddenHead) do
			# if letter is hidden, just put "_" in acc
			compareTileHidden(tileTail, hiddenTail, acc ++ ["_"])
		else
			# if it's not hidden, add the letter to acc.
			compareTileHidden(tileTail, hiddenTail, acc ++ [tileHead])
		end
	end

	def compareTileHidden([], isHidden, acc) do
		acc
	end

  def guess(game, letter) do
    if letter == "z" do
      raise "That's not a real letter"
    end

    gs = game.guesses
    |> MapSet.new()
    |> MapSet.put(letter)
    |> MapSet.to_list

    Map.put(game, :guesses, gs)
  end

	def hideBoth(game, hideOne) do
			isHidden = game.isHidden
			hideOne = game.hideOne
			hideTwo = game.hideTwo
			disabled = game.disabled
			IO.puts "Echo"
			newHidden = List.replace_at(isHidden, hideOne, true)
			|> List.replace_at(hideTwo, true)
			newHideOne = nil
			newHideTwo = nil
			newDisabled = false
			Map.put(game, :isHidden, newHidden)
			|> Map.put(:hideOne, newHideOne)
			|> Map.put(:hideTwo, newHideTwo)
			|> Map.put(:disabled, newDisabled)
	end

	def reset(game) do
		new()
	end

	def handle_click(game, index) do
		tiles = game.tiles
		isHidden = game.isHidden
		firstChoiceIndex = game.firstChoiceIndex
		disabled = game.disabled
		score = game.score
		hideOne = game.hideOne
		hideTwo = game.hideTwo
		if (firstChoiceIndex == nil) do # && Enum.at(isHidden, index)) do
			if (Enum.at(isHidden, index)) do
				newHidden = List.replace_at(isHidden, index, false)
				newFirstChoiceIndex = index
				newScore = score + 1
				newHideOne = index
				Map.put(game, :isHidden, newHidden)
				|> Map.put(:firstChoiceIndex, newFirstChoiceIndex)
				|> Map.put(:score, newScore)
				|> Map.put(:hideOne, newHideOne)
			else 
				game
			end
		else
			IO.inspect(firstChoiceIndex)
			IO.inspect(Enum.at(tiles, firstChoiceIndex))
			IO.inspect(Enum.at(tiles, index))
			IO.inspect(Enum.at(tiles, index) == Enum.at(tiles, firstChoiceIndex))
			cond do
				Enum.at(tiles, index) == Enum.at(tiles, firstChoiceIndex)
					 && index != firstChoiceIndex ->
					newHidden = List.replace_at(isHidden, index, false)
					newFirstChoiceIndex = nil
					newScore = score + 1
					newHideOne = nil
					newHideTwo = nil
					Map.put(game, :isHidden, newHidden)
					|> Map.put(:firstChoiceIndex, newFirstChoiceIndex)
					|> Map.put(:score, newScore)
					|> Map.put(:hideOne, newHideOne)
					|> Map.put(:hideTwo, newHideTwo)
				(index == firstChoiceIndex || !Enum.at(isHidden, index)) ->
					game
				true ->
					newHidden = List.replace_at(isHidden, index, false)
					|> List.replace_at(firstChoiceIndex, false)
					newDisabled = true;
					newHideOne = index
					newHideTwo = firstChoiceIndex
					newFirstChoiceIndex = nil
					newScore = score + 1
					Map.put(game, :isHidden, newHidden)
					|> Map.put(:firstChoiceIndex, newFirstChoiceIndex)
					|> Map.put(:disabled, newDisabled)
					|> Map.put(:hideOne, newHideOne)
					|> Map.put(:hideTwo, newHideTwo)
					|> Map.put(:firstChoiceIndex, newFirstChoiceIndex)
					|> Map.put(:score, newScore)
			end
		end
	end

	def initialize_tiles() do
		alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"]
		Enum.shuffle(alphabet ++ alphabet)
	end
	
	def initialize_hidden() do
		List.duplicate(true, 16)
	end
end
IO.inspect(Memory.Game.new().tiles)
game1 = Memory.Game.new()
IO.inspect(Memory.Game.shownTiles(game1.tiles, game1.isHidden))
