package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.response.PartnerResp;

public interface PartnerService {
	PartnerResp registerPartner(PartnerRegisterDTO dto);
}

