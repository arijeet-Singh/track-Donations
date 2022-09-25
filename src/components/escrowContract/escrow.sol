//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract escrow {
    mapping(address => uint256) public receiverTargetPair; // PAIRS THE CAMPAIGN ADDRESS WITH ITS' TARGET.

    struct Details {
        string email;
        uint256 minimum;
        string ngo;
        string objective;
        string phone;
        uint256 target;
        address wallet;
    } // STRUCTURE OF CAMPAIGN DETAILS
    event Added(
        string email,
        uint256 minimum,
        string ngo,
        string objective,
        string phone,
        uint256 target,
        address wallet
    ); // THIS EVENT IS EMITTED WHEN THE CAMPAIGN HAS BEEN ADDED SUCCESSFULLY.

    struct amountDonated {
        address receiver;
        uint256 amount;
    } // THIS HELPS IN KEEPING TRACK OF THE TOTAL DONATION A CAMPAIGN HAS RECEIVED.

    mapping(address => amountDonated) public totalDonation; // AGAIN, HELPS IN KEEPING TRACK OF THE TOTAL DONATION A CAMPAIGN HAS RECEIVED.
    Details[] campaigns;

    function addCampaign(
        string memory email,
        uint256 minimum,
        string memory ngo,
        string memory objective,
        string memory phone,
        uint256 target,
        address wallet
    ) public {
        campaigns.push(
            Details(email, minimum, ngo, objective, phone, target, wallet)
        ); // THIS FUNCTION ADDS THE CAMPAIGN DETAILS TO BLOCKCHAIN.
        receiverTargetPair[wallet] = target;
        emit Added(email, minimum, ngo, objective, phone, target, wallet);
    }

    function getCampaigns() public view returns (Details[] memory) {
        return campaigns;
    }

    //----------------------------------------------------------------------------------------------------------------------------

    event Funded(address sender, address receiver); // EMITTED WHEN A DONOR HAS DONATED TO THE CAMPAIGN.
    mapping(address => uint256) public receiverDonationPair; // HELPS IN KEEPING TRACK OF THE CURRENT BALANCE OF THE CAMPAIGN.
    mapping(address => mapping(address => bool)) public receiverDonorPair; 
    // PAIRS THE CAMPAIGN ADDRESS WITH ITS' DONOR'S ADDRESS: RETURNS TRUE IF A GIVEN ADDRESS IS A DONOR OF THAT CAMPAIGN.
    function fund(address payable receiver) public payable {
        if (totalDonation[receiver].amount == receiverTargetPair[receiver]) {
            revert("TARGET REACHED");
        } else {
            receiverDonationPair[receiver] += msg.value; // INCREASE THE BALANCE OF THE CAMPAIGN.
            totalDonation[receiver].amount += msg.value; // INCREASE TEH AMOUNT OF DONATION RECEIVED SO FAR.
            receiverDonorPair[receiver][msg.sender] = true; // MARK TRUE THAT msg.sender (DONOR) HAS DONATED TO receiver (CAMPAIGN);
            emit Funded(msg.sender, receiver);
        }
    }

    function getTotalDonation(address receiver) public view returns (uint256) {
        return totalDonation[receiver].amount; // RETURNS THE TOTAL DONATION RECEIVED BY receiver (CAMPAIGN).
    }

    function returnMapping(address receiver) public view returns (uint256) {
        return receiverDonationPair[receiver]; // RETURNS THE BALANCE OF receiver (CAMPAIGN).
    }

    function checkIfFunder(address sender, address receiver)
        public
        view
        returns (bool)
    {
        return receiverDonorPair[receiver][sender]; // CHECK IF AN ADDRESS IS A DONOR OF THE CAMPAIGN.
    }

    //-----------------------------------------------------------------------------------------------------------------

    struct PaymentDetails {
        string from;
        string to;
        string vendorName;
        string vendorLocation;
        string amount;
        string date;
    } //STRUCTURE OF PAYMENT DETAILS.
    event PaymentDone(
        string from,
        string to,
        string vendorName,
        string vendorLocation,
        string amount,
        string date
    ); //EMITTED WHEN PAYMENT IS SUCCESSFUL.
    PaymentDetails[] details;

    function paymentToVendor(
        string memory from,
        string memory to,
        string memory vendorName,
        string memory vendorLocation,
        string memory amount,
        string memory date
    ) public {
        details.push(
            PaymentDetails(from, to, vendorName, vendorLocation, amount, date)
        ); // STORE THE DETAILS ON BLOCKCHAIN.
        emit PaymentDone(from, to, vendorName, vendorLocation, amount, date);
    }

    function pay(
        address payable receiver,
        address payable _to,
        uint256 amount
    ) public {
        _to.transfer(amount); //FIRST, TRANSFER THE AMOUNT TO THE VENDOR.
        receiverDonationPair[receiver] -= amount; //NOW, REDUCE THE BALANCE OF THE CAMPAIGN.
    }

    function getDetails() public view returns (PaymentDetails[] memory) {
        return details; //RETURNS DETAILS OF ALL THE PAYMENTS MADE, BY ANY ACCOUNT.
    }
}
