{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            tailwindcss
            playwright-driver.browsers
          ];

          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

          shellHook = ''
            echo "jordangarrison.dev dev shell loaded"
            echo "  bun: $(bun --version)"
            echo "  playwright browsers: $PLAYWRIGHT_BROWSERS_PATH"
          '';
        };
      }
    );
}
