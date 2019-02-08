defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

	alias Memory.Game
	alias Memory.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
     	game = BackupAgent.get(name) || Game.new()
			BackupAgent.put(name, game)
			socket = socket
			|> assign(:game, game)
			|> assign(:name, name)
			{:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("click", %{"index" => i}, socket) do
		name = socket.assigns[:name]
		game = Game.handle_click(socket.assigns[:game], i)
		socket = assign(socket, :game, game)
		BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end
		
	def handle_in("hide", %{"hideOne" => hideOne}, socket) do
		name = socket.assigns[:name]
		game = Game.hideBoth(socket.assigns[:game], hideOne)
		socket = assign(socket, :game, game)
		BackupAgent.put(name, game)
		{:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
	end

	def handle_in("reset", num, socket) do
		name = socket.assigns[:name]
		game = Game.reset(socket.assigns[:game])
		socket = assign(socket, :game, game)
		BackupAgent.put(name, game)
		{:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
	end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
