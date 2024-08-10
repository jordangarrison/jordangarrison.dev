{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
    in {
      devShells = forEachSystem (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.jq
              pkgs.nil
              pkgs.nodejs
              pkgs.docker
              pkgs.nodePackages.svelte-language-server
              pkgs.nodePackages.npm
              pkgs.nodePackages.prettier
            ];
          };
        });
    };
}
