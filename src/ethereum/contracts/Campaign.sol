
pragma solidity ^0.4.17;


//this contract will be used to create an instance of another contract
contract CampaignFactory {
    address[] public deployedCampaigns;

    //takes in a min value that the campaign expects
    function createCampaign(uint minimum) public {
      //we need to pass in the address of the person who is creating a campaign to the campaign constructor
        address newCampaign = new Campaign(minimum, msg.sender);//new campaign that gets delpoyed ot the blockchain, after depolyment occiurs, this will return an address
        deployedCampaigns.push(newCampaign);//add to deployed campaigns array
    }

    //return array of created campaigns
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }

}


contract Campaign {
    //struct to represent a  request that will be made by the manager to the vendor
    //a request needs to be approved by some percentage of the persons who paid their money into this campaign in order for the request to be approved ie. manager can send money to that vendor
    // when we create a struct we have to initalize value types but not reference types, a mapping is a ref type
    struct Request {
        string description;//description of request
        uint value;//amount of money manager wants to send to vendor
        address recipient;//address of the vendor
        bool complete;//has the request already been sent?
        uint approvalCount;//used to keep track of approved persons in order to know if the majority of persons want the request approved
        mapping(address => bool) approvals;//we are defining a mapping(hashfunction), keys are addresses and values are booleans
    }

    //when we declare variables below, an instance is automatically created but when we create a struct, we need to create the instance ourselves
    Request[] public requests;
    address public manager;//whenever we mark a variable as public, a get method is automatically created for us, so we can call managers()
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    //makes sure we are the manager
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    //constructor - create a new instance of a campaign
    //we need to pass in the address of the person who is creating a campaign to the campaign constructor
    function Campaign(uint minimum, address creator) public {
        manager = creator;//sent the manager to be the person who created the campaign
        minimumContribution = minimum;//the minimum amount to join the campaign
    }

    //join the campaign
    function contribute() public payable {
        require(msg.value > minimumContribution);//must meet minimum contribution

        //once we meet the min contribution, we add the person who opted to join the campaign to the approvers hashtable
        approvers[msg.sender] = true;//add a new key with value (msg.sender) to the mapping
        //we need to keep a count of how many people have been added to campaign in order to finalize a request,
        //the hashfunction does not allow looping to get a count or no .length function so we have to manually check
        approversCount++;
    }

    //create a request with a description, value and address of the vendor
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);//add request to array of request
    }

    //person can vote if they want to approve the request by the manager to spend on a particular vendor
    function approveRequest(uint index) public {
      //index is index in array of request we are trying to approve
        // Request storage request = requests[index];

        require(approvers[msg.sender]);//make sure that person is a donator
        require(!requests[index].approvals[msg.sender]);//make sure person has not voted on this request before

        requests[index].approvals[msg.sender] = true;//make sure they cant vote twice
        requests[index].approvalCount++;
    }

    //manager will call in order to finalize a request
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);//take money specified in request and send to recipient, because recipient is an address it has a transfer method on it
        request.complete = true;
    }


    //RETURNS not RETURN
  function getSummary() public view returns (
   uint, uint, uint, uint, address
     ) {
     return (
           minimumContribution,
           this.balance,
           requests.length,
           approversCount,
           manager
         );
     }

     function getRequestsCount() public view returns (uint) {
         return requests.length;
     }
}
