'use strict';
var viewWalletCtrl = function($scope, walletService) {
	walletService.wallet = null;
	walletService.password = '';
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
        $scope.showEnc = walletService.password != '';
		$scope.blob = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toJSON());
		if (walletService.password != '') {
			$scope.blobEnc = globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toV3(walletService.password, {
				kdf: globalFuncs.kdf,
				n: globalFuncs.scrypt.n
			}));
            $scope.encFileName =  $scope.wallet.getV3Filename();
		}
        ajaxReq.getBalance($scope.wallet.getAddressString(), function(data){
            if(data.error){
                $scope.etherBalance = data.msg;
            } else {
                $scope.etherBalance = etherUnits.toEther(data.data.balance,'wei');
                ajaxReq.getETHvalue(function(data){
                    $scope.usdBalance =  etherUnits.toFiat($scope.etherBalance,'ether',data.usd);
                    $scope.eurBalance =  etherUnits.toFiat($scope.etherBalance,'ether',data.eur);
                    $scope.btcBalance =  etherUnits.toFiat($scope.etherBalance,'ether',data.btc);
                });
            }
        });
	});
	$scope.printQRCode = function() {
		globalFuncs.printPaperWallets(JSON.stringify([{
			address: $scope.wallet.getAddressString(),
			private: $scope.wallet.getPrivateKeyString()
		}]));
	}
};
module.exports = viewWalletCtrl;