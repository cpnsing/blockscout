import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import ValidatorABI from "../../ABI/validator.json";
import { useAccount, useBalance } from 'wagmi';
import { ADDRESS_COUNTERS, ADDRESS_INFO } from 'stubs/address';
import useApiQuery from 'lib/api/useApiQuery';

const address = "0x0000000000000000000000000000000000001001";

const fetchContractData = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  abi: any[],
  functionName: string
) => {
  const contract = new ethers.Contract(address, abi, provider);
  return await contract[functionName]();
};

const fetchContractDataAddress = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  abi: any[],
  functionName: string,
  dataAddr: string
) => {
  const contract = new ethers.Contract(address, abi, provider);
  // const balanceOf = await contract.methods.balanceOf(dataAddr).call();
  // console.log(">>>>>>>>>balanceOf", balanceOf);

  return await contract[functionName](dataAddr);
};



const useContractData = () => {
  const provider = new ethers.providers.JsonRpcProvider('https://devnet-taral-rpc1.tarality.com');
  const [validatorData, setValidatorData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const validators = await fetchContractData(provider, address, ValidatorABI, "validators");
        const validatorDetails = await Promise.all(
          validators.map(async (validatorAddress: any) => {
            const isValidator = await fetchContractDataAddress(provider, address, ValidatorABI, "isValidator", validatorAddress);
            if (isValidator) {
              const stakedAmount = await fetchContractDataAddress(provider, address, ValidatorABI, "accountStake", validatorAddress);
              const formattedAmount = ethers.utils.formatEther(stakedAmount);
              console.log(">>>>>>validatorAddresschecking", validatorAddress);







              // const { data } = useBalance({
              //   // address: validatorAddress,
              //   address: validatorAddress
              // });
              // console.log(">>>>>>>>>>>>>>>>validatorAddress", validatorAddress, data);

              // console.log(">>>>>>datacheckingdata", validatorAddress, data, isError, isLoading);

              return { address: validatorAddress, amount: formattedAmount };
            }
            return null;
          })
        );

        setValidatorData(validatorDetails.filter(Boolean));
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  return { validatorData, isLoading, error };
};

export default useContractData;
